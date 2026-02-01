"use client";

import { trpc } from "@/lib/trpc";
import { Car, Cat, Phone, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function HouseholdTab() {
  const utils = trpc.useUtils();

  // Queries
  const { data: vehicles } = trpc.profile.getVehicles.useQuery();
  const { data: pets } = trpc.profile.getPets.useQuery();
  const { data: contacts } = trpc.profile.getContacts.useQuery();

  // Mutations
  const addVehicle = trpc.profile.addVehicle.useMutation({ onSuccess: () => utils.profile.getVehicles.invalidate() });
  const deleteVehicle = trpc.profile.deleteVehicle.useMutation({ onSuccess: () => utils.profile.getVehicles.invalidate() });

  const addPet = trpc.profile.addPet.useMutation({ onSuccess: () => utils.profile.getPets.invalidate() });
  const deletePet = trpc.profile.deletePet.useMutation({ onSuccess: () => utils.profile.getPets.invalidate() });

  const addContact = trpc.profile.addContact.useMutation({ onSuccess: () => utils.profile.getContacts.invalidate() });
  const deleteContact = trpc.profile.deleteContact.useMutation({ onSuccess: () => utils.profile.getContacts.invalidate() });

  // Forms
  const [vehicleForm, setVehicleForm] = useState({ plateNumber: "", model: "" });
  const [petForm, setPetForm] = useState({ name: "", type: "DOG" as const, description: "" });
  const [contactForm, setContactForm] = useState({ name: "", phoneNumber: "", relation: "" });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* --- VEHICLES SECTION --- */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-indigo-600" />
                Araçlarım
            </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {vehicles?.map(vehicle => (
                <div key={vehicle.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center group">
                    <div>
                        <p className="font-bold text-gray-800">{vehicle.plateNumber}</p>
                        <p className="text-sm text-gray-500">{vehicle.model}</p>
                        {vehicle.verified ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">Onaylı</span>
                        ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full mt-1 inline-block">Onay Bekliyor</span>
                        )}
                    </div>
                    <button 
                        onClick={() => deleteVehicle.mutate({ id: vehicle.id })}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>

        <form 
            onSubmit={(e) => {
                e.preventDefault();
                addVehicle.mutate(vehicleForm);
                setVehicleForm({ plateNumber: "", model: "" });
            }}
            className="flex flex-col md:flex-row gap-2"
        >
            <input 
                placeholder="Plaka (34 AB 123)" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={vehicleForm.plateNumber}
                onChange={e => setVehicleForm({...vehicleForm, plateNumber: e.target.value})}
                required
            />
            <input 
                placeholder="Model (Beyaz Ford)" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={vehicleForm.model}
                onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})}
                required
            />
            <button disabled={addVehicle.isPending} className="bg-indigo-600 text-white p-3 md:p-2 rounded-lg hover:bg-indigo-700 flex justify-center items-center">
                <Plus className="w-5 h-5" />
                <span className="md:hidden ml-2 font-medium">Ekle</span>
            </button>
        </form>
      </section>

      {/* --- PETS SECTION --- */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Cat className="w-5 h-5 text-orange-500" />
                Evcil Hayvanlarım
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {pets?.map(pet => (
                <div key={pet.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center group">
                    <div>
                        <p className="font-bold text-gray-800">{pet.name}</p>
                        <p className="text-sm text-gray-500">{pet.type} - {pet.description}</p>
                    </div>
                    <button 
                        onClick={() => deletePet.mutate({ id: pet.id })}
                        className="text-red-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>

        <form 
            onSubmit={(e) => {
                e.preventDefault();
                addPet.mutate({ ...petForm, type: petForm.type as any });
                setPetForm({ name: "", type: "DOG", description: "" });
            }}
            className="flex flex-col md:flex-row gap-2"
        >
             <select 
                className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={petForm.type}
                onChange={e => setPetForm({...petForm, type: e.target.value as any})}
            >
                <option value="DOG">Köpek</option>
                <option value="CAT">Kedi</option>
                <option value="BIRD">Kuş</option>
                <option value="OTHER">Diğer</option>
            </select>
            <input 
                placeholder="İsim (Pamuk)" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={petForm.name}
                onChange={e => setPetForm({...petForm, name: e.target.value})}
                required
            />
             <input 
                placeholder="Cins/Renk" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={petForm.description}
                onChange={e => setPetForm({...petForm, description: e.target.value})}
            />
            <button disabled={addPet.isPending} className="bg-orange-500 text-white p-3 md:p-2 rounded-lg hover:bg-orange-600 flex justify-center items-center">
                <Plus className="w-5 h-5" />
                <span className="md:hidden ml-2 font-medium">Ekle</span>
            </button>
        </form>
      </section>

      {/* --- EMERGENCY CONTACTS --- */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Acil Durum Kişileri
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {contacts?.map(contact => (
                <div key={contact.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center group">
                    <div>
                        <p className="font-bold text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.relation} • {contact.phoneNumber}</p>
                    </div>
                    <button 
                        onClick={() => deleteContact.mutate({ id: contact.id })}
                        className="text-red-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>

        <form 
            onSubmit={(e) => {
                e.preventDefault();
                addContact.mutate(contactForm);
                setContactForm({ name: "", phoneNumber: "", relation: "" });
            }}
            className="flex flex-col md:flex-row gap-2"
        >
            <input 
                placeholder="Ad Soyad" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={contactForm.name}
                onChange={e => setContactForm({...contactForm, name: e.target.value})}
                required
            />
            <input 
                placeholder="Tel (05...)" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={contactForm.phoneNumber}
                onChange={e => setContactForm({...contactForm, phoneNumber: e.target.value})}
                required
            />
            <input 
                placeholder="Yakınlık (Anne)" 
                className="border p-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                value={contactForm.relation}
                onChange={e => setContactForm({...contactForm, relation: e.target.value})}
                required
            />
            <button disabled={addContact.isPending} className="bg-red-500 text-white p-3 md:p-2 rounded-lg hover:bg-red-600 flex justify-center items-center">
                <Plus className="w-5 h-5" />
                <span className="md:hidden ml-2 font-medium">Ekle</span>
            </button>
        </form>
      </section>

    </div>
  );
}
