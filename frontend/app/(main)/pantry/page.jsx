"use client";

import {
  deletePantryItems,
  getPantryItems,
  updatePantryItems,
} from "@/actions/pantry.actions";
import AddToPantryModal from "@/components/AddToPantryModal";
import PricingModal from "@/components/PricingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import {
  CheckIcon,
  ChefHatIcon,
  Edit2Icon,
  Loader2Icon,
  PackageIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const PantryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", quantity: "" });

  // Fetch pantry items
  const {
    loading: loadingItems,
    data: itemsData,
    fn: fetchItems,
  } = useFetch(getPantryItems);

  // Delete pantry items
  const {
    loading: deleting,
    data: deleteData,
    fn: deleteItems,
  } = useFetch(deletePantryItems);

  // Update pantry items
  const {
    loading: updating,
    data: updateData,
    fn: updateItems,
  } = useFetch(updatePantryItems);

  //load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  //update items when data arrives
  useEffect(() => {
    if (itemsData?.success) {
      setItems(itemsData.items);
    }
  }, [itemsData]);

  useEffect(() => {
    if (deleteData?.success && !deleting) {
      toast.success("Item removed from pantry");
      fetchItems();
    }
  }, [deleteData]);

  useEffect(() => {
    if (updateData?.success && !updating) {
      toast.success("Item updated");
      setEditingId(null);
      fetchItems();
    }
  }, [updateData]);

  const handleDelete = async (itemId) => {
    const formData = new FormData();
    formData.append("itemId", itemId);
    await deleteItems(formData);
    fetchItems();
  };

  //start edit
  const startEdit = (item) => {
    setEditingId(item.documentId);
    setEditValues({ name: item.name, quantity: item.quantity });
  };
  // save edit
  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("itemId", editingId);
    formData.append("name", editValues.name);
    formData.append("quantity", editValues.quantity);
    await updateItems(formData);

  };
  // cancel edit

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", quantity: "" });
  };

  const handleModalSuccess = () => {
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4 overflow-y-auto">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <PackageIcon className="h-16 w-16 text-orange-600" />
              <div className="">
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                  My Pantry
                </h2>
                <p className="font-light text-stone-600">
                  Manage your ingredients and discover new recipes
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer group"
              size="lg"
              variant="primary"
            >
              <PlusIcon className="size-5 group-hover:rotate-180 transition duration-300" />
              Add to Pantry
            </Button>
          </div>
          {itemsData?.scansLimit !== undefined && (
            <div className="bg-white py-3 px-4 border-2 border-stone-200 inline-flex items-center gap-3">
              <SparklesIcon className="h-5 w-5 text-orange-600" />
              <div className="text-sm">
                {itemsData.scansLimit === "unlimited" ? (
                  <>
                    <span className="font-bold text-green-600">∞</span>
                    <span className="text-stone-500">
                      {" "}
                      Unlimited AI scans (Pro Plan){" "}
                    </span>
                  </>
                ) : (
                  <PricingModal>
                    <span className="text-stone-500 cursor-pointer">
                      {" "}
                      Upgrade to Pro for unlimited AI scans{" "}
                    </span>
                  </PricingModal>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Quick Action Card - Find Recipes */}
        {items.length > 0 && (
          <Link href={"/pantry/recipes"} className="block mb-8">
            <div className="bg-linear-to-br from-green-600 to-emerald-500 text-white p-6 border-2 border-emerald-700 hover:shadow-xl hover:translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 border-2 border-white/30 group-hover:bg-white/30 transition-colors">
                  <ChefHatIcon className="size-8 group-hover:rotate-360 transition duration-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">
                    What can I cook today?
                  </h3>
                  <p className="text-green-100 text-sm font-light">
                    Get AI powered suggestions from your {items.length}{" "}
                    {items.length === 1 ? "ingredient" : "ingredients"}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Badge className="bg-white/20 text-white border-2 border-white/30 font-bold uppercase tracking-wide">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        )}
        {/*Loading State  */}
        {loadingItems && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2Icon className="h-16 w-16 text-orange-600 animate-spin mb-4" />
            <p className="text-stone-500">Loading your pantry...</p>
          </div>
        )}
        {/* Pantry items grid */}
        {!loadingItems && items.length > 0 && (
          <div className="">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-900">
                Your ingredients
              </h2>
              <Badge
                className="border-stone-900 border-2 text-stone-600 font-bold uppercase tracking-wide"
                variant="outline"
              >
                {items.length} {items.length === 1 ? "item" : "items"}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.documentId}
                  className="bg-white p-5 border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all"
                >
                  {editingId === item.documentId ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues({ ...editValues, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-stone-200 rounded-md focus:outline-none focus:border-orange-600 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Quantity"
                        value={editValues.quantity}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            quantity: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-stone-200 rounded-md focus:outline-none focus:border-orange-600 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updating}
                          onClick={cancelEdit}
                          className="flex-1 border-stone-900 hover:bg-stone-700 border-2 hover:text-white cursor-pointer"
                        >
                         <XIcon className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          disabled={updating}
                          onClick={saveEdit}
                          className="flex-1 bg-green-600 hover:bg-green-700 border-2 border-green-700 cursor-pointer"
                        >
                          {updating ? (
                            <Loader2Icon className="size-4 animate-spin" />
                          ) : (
                            <CheckIcon className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 text-stone-900">
                            {item.name}
                          </h3>
                          <p className="text-stone-500 text-sm font-light">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 border-2 border-transparent hover:border-orange-600 hover:bg-orange-50 transition-all text-stone-600 hover:text-orange-600 rounded-full cursor-pointer"
                          >
                            <Edit2Icon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.documentId)}
                            disabled={deleting}
                            className="p-2 border-2 border-transparent hover:border-red-600 hover:bg-red-50 transition-all text-stone-600 hover:text-red-600 rounded-full cursor-pointer"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-stone-400">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loadingItems && items.length === 0 && (
          <div className="bg-white p-12 text-center border-2 border-dashed border-stone-200">
            <div className="bg-orange-50 size-20 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6">
              <PackageIcon className="size-10 text-orange-600" />
            </div>
            <h3 className="text-stone-900 font-bold text-2xl mb-2">
              Your pantry is empty.
            </h3>
          </div>
        )}
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
