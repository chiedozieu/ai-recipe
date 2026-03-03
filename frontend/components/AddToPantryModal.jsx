"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import useFetch from "@/hooks/use-fetch";
import {
  addPantryItemManually,
  deletePantryItems,
  getPantryItems,
  saveToPantry,
  scanPantryImage,
  updatePantryItems,
} from "@/actions/pantry.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CameraIcon, Loader, Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";
import { Button } from "./ui/button";

const AddToPantryModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [manualItem, setManualItem] = useState({
    name: "",
    quantity: "",
  });

  // scan image
  const {
    loading: scanning,
    data: scanData,
    fn: scanImage,
  } = useFetch(scanPantryImage);

  // update scanned ingredients when scan completes
  useEffect(() => {
    if (scanData?.success && scanData?.ingredients > 0) {
      setScannedIngredients(scanData.ingredients);
      toast.success(`Found ${scanData.ingredients.length} ingredients!`);
    }
  }, [scanData]);

  // save scanned items
  const {
    loading: saving,
    data: saveData,
    fn: saveScannedItems,
  } = useFetch(saveToPantry);

  // add manual items
  const {
    loading: adding,
    data: addData,
    fn: addManualItem,
  } = useFetch(addPantryItemManually);

  // handle manual add success
  useEffect(() => {
    if (addData?.success) {
      toast.success("Item added to pantry");
      setManualItem({
        name: "",
        quantity: "",
      });
      handleClose(); // Close the modal after successful addition
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [addData]);

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
      toast.error("Please enter a name and quantity");
      return;
    }
    const formData = new FormData();
    formData.append("name", manualItem.name);
    formData.append("quantity", manualItem.quantity);
    await addManualItem(formData);
  };

  // handle image selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setScannedIngredients([]); // reset when new image is selected
  };

  const handleClose = () => {
    setActiveTab("scan");
    setSelectedImage(null);
    setScannedIngredients([]);
    setManualItem({
      name: "",
      quantity: "",
    });
    onClose();
  };

  //  scan image
  const handleScan = async () => {
    if (!selectedImage) {
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedImage);
    await scanImage(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add to Pantry
          </DialogTitle>
          <DialogDescription>
            {scannedIngredients.length === 0 ? (
              <div className="space-7-4">{/* image uploader  */}</div>
            ) : (
              <div className=""></div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan" className="gap-2 cursor-pointer ">
              <CameraIcon className="size-4" />
              AI Scan
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2 cursor-pointer">
              <PlusIcon className="size-4" />
              Add Manually
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6 mt-6">
            {scannedIngredients.length === 0 ? (
              <div className="space-y-4">
                {/* image uploader */}
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  loading={scanning}
                />
                {selectedImage && !scanning && (
                  <Button
                    onClick={handleScan}
                    className="w-full h-12 text-lg cursor-pointer"
                    variant="primary"
                    disabled={scanning}
                  >
                    {scanning ? (
                      <>
                        <Loader2Icon className="size-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                       <>
                        <CameraIcon className="size-5 mr-2" />
                        Scan Image
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className=""></div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <form onSubmit={handleAddManual} className="space-y-4">
              <div className="">
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Ingredients Name
                </label>
                <input
                  type="text"
                  disabled={adding}
                  value={manualItem.name}
                  placeholder="e.g., beef"
                  onChange={(e) =>
                    setManualItem({ ...manualItem, name: e.target.value })
                  }
                  className="border border-stone-200 rounded-xl w-full px-4 py-3  focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="">
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Quantity
                </label>
                <input
                  type="text"
                  disabled={adding}
                  value={manualItem.quantity}
                  placeholder="e.g., 500g, 2cups etc"
                  onChange={(e) =>
                    setManualItem({ ...manualItem, name: e.target.value })
                  }
                  className="border border-stone-200 rounded-xl w-full px-4 py-3  focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                disabled={adding}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {adding ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <span className="gap-2 text-sm flex items-center">
                    <PlusIcon className="size-5" /> Add Item
                  </span>
                )}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPantryModal;
