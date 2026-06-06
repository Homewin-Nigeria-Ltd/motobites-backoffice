"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RestaurantCard } from "@/features/restaurant/components/restaurant-card";
import { RestaurantFormModal } from "@/features/restaurant/components/restaurant-form-modal";
import { useRestaurants } from "@/features/restaurant";
import { Button } from "@/components/ui/button";
import { AppLoader } from "@/components/ui/app-loader";
import { Input } from "@/components/ui/input";
// ...existing code...

export function RestaurantsSection() {
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    data: restaurants = [],
    isPending,
    isError,
    error,
  } = useRestaurants();

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return restaurants;

    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query),
    );
  }, [restaurants, search]);

  if (isError) {
    throw error;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="mb-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden>←</span>
            Menu catalog
          </Link>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex-1">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search kitchen"
              className="h-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="h-10 px-4"
              icon={{ name: "add", position: "left" }}
              onClick={() => setAddOpen(true)}
            >
              Add New Kitchen
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {isPending ? (
            <AppLoader />
          ) : filteredRestaurants.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {search
                  ? `No kitchens found for "${search}".`
                  : "No kitchens found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>

      <RestaurantFormModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
