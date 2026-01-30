
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../src/server/routers/_app';

// global.fetch is available in Node 20+

const API_URL = 'http://localhost:3000/api/trpc';

async function main() {
    console.log('🚀 Starting E2E Verification...');

    // 1. Create Clients
    // We need two clients, but tRPC client carries headers via link config.
    // We'll create helper to get client with token.
    const createClient = (token: string) => {
        return createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: API_URL,
                    transformer: superjson,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]
        });
    };

    // 2. Login as Admin
    console.log('🔑 Logging in as Admin...');
    // We'll use the raw fetch for auth since mutation might not return token in tRPC client if not set up standardly?
    // Wait, auth.login IS a tRPC mutation.
    // But we need a client WITHOUT token first.
    const publicClient = createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                url: API_URL,
                transformer: superjson,
            })
        ]
    });

    let adminToken = "";
    let residentToken = "";
    let residentId = "";

    try {
        const adminAuth = await publicClient.auth.login.mutate({
            email: "admin@example.com", // Assumes seeded data
            password: "changeme123"
        });
        adminToken = adminAuth.token;
        console.log('✅ Admin Logged In');
    } catch (e) {
        const email = `admin_${Date.now()}@example.com`;
        const password = "password123";
        try {
            await publicClient.auth.register.mutate({
                email,
                password,
                fullName: "Test Admin",
                role: "admin",
                phoneNumber: `555${Date.now().toString().slice(-7)}`
            });
            
            const loginRes = await publicClient.auth.login.mutate({ email, password });
            adminToken = loginRes.token;
            console.log('✅ Created & Logged In New Admin:', email);
        } catch (regErr) {
            console.error('❌ Failed to Register Admin:', regErr);
            process.exit(1);
        }
    }

    // 3. Login as Resident
    console.log('🔑 Logging in as Resident...');
    try {
         const email = `resident_${Date.now()}@test.com`;
         const password = "password123";
         
         await publicClient.auth.register.mutate({
             email,
             password,
             fullName: "Test Resident",
             role: "resident",
             phoneNumber: `555${Date.now().toString().slice(-7)}`
         });
         
         // Must login to get token
         const loginRes = await publicClient.auth.login.mutate({ email, password });
         residentToken = loginRes.token;
         residentId = loginRes.user.id;
         console.log('✅ Resident Registered & Logged In:', email);
    } catch (e) {
        console.error('❌ Resident Login/Register Failed:', e);
        process.exit(1);
    }

    const adminClient = createClient(adminToken);
    const residentClient = createClient(residentToken);

    // 4. Admin Creates Announcement (Skipped in favor of Ticket flow)
    
    console.log('🎫 Resident creating ticket...');
    const [ticket] = await residentClient.ops.createTicket.mutate({
        category: "other",
        title: "Test Ticket for Notification",
        description: "Checking if I get notified",
        urgency: "low"
    });
    console.log('✅ Ticket Created:', ticket.id);

    // 5. Admin Updates Ticket
    console.log('🛠️ Admin updating ticket status...');
    await adminClient.ops.updateTicketStatus.mutate({
        ticketId: ticket.id,
        status: "in_progress"
    });
    console.log('✅ Ticket Updated to in_progress');

    // 6. Resident Checks Notifications
    console.log('🔔 Resident checking notifications...');
    // Give a small delay for async processing if any (though here it's sync in procedure)
    const notifications = await residentClient.notifications.getNotifications.query({ limit: 10 });
    
    const targetNotif = notifications.find(n => n.title === "Talep Güncellemesi" && n.link?.includes("requests"));
    
    if (targetNotif) {
        console.log('✅ SUCCESS! Notification Found:', targetNotif.message);
        console.log('🎉 E2E Verification Passed!');
    } else {
        console.error('❌ FAILURE! Notification NOT found.');
        console.log('Recent Notifications:', notifications);
        process.exit(1);
    }

}

main();
