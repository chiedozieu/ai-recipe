"use client";

import AddToPantryModal from "@/components/AddToPantryModal";
import { Button } from "@/components/ui/button";
import { PackageIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";

const PantryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", quantity: "" });


  const handleModalSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <PackageIcon className="h-16 w-16 text-orange-600" />
              <div className="">
                <h className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                  My Pantry
                </h>
                <p className="font-light text-stone-600">
                  Manage your ingredients and discover new recipes
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex cursor-pointer"
              size="lg"
              variant="primary"
            >
              <PlusIcon className="size-5" />
              Add to Pantry
            </Button>
          </div>
        </div>
        {/* Quick Action Card - Find Recipes */}
        {/*Loading State  */}
        {/* Pantry items grid */}
        {/* Empty state */}
      </div>
      {/* add to pantry modal */}
      
        <AddToPantryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
    
    </div>
  );
};

export default PantryPage;
