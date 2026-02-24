import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <section className="pt-32 pb-20 px-4">
        <Button variant="primary" size="xl">
          Login
        </Button>
        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
        />
      </section>
    </div>
  );
}
