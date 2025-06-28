"use client";

import Banner from "@/components/home/banner";
import Header from "@/components/home/header";
import Sidebar from "@/components/home/sidebar";
import DesignTypes from "@/components/home/design-types";
import AiFeatures from "@/components/home/ai-features";
import RecentDesigns from "@/components/home/recent-designs";
import { useEditorStore } from "@/store";
import { useEffect } from "react";
import { getUserSubscription } from "@/services/subscription-service";
import { getUserDesigns } from "@/services/design-service";
import SubscriptionModal from "@/components/subcscription/premium-modal";

export default function HomePage() {
  const {
    setUserSubscription,
    setUserDesigns,
    showPremiumModal,
    setShowPremiumModal,
  } = useEditorStore();

  const fetchSubscription = async () => {
    const response = await getUserSubscription();
    console.log(response, "response from fetchSubscription");

    if (response?.success) setUserSubscription(response?.data);
  };

  async function fetchDesigns() {
    const result = await getUserDesigns();
    // console.log(result, "result from USER DESIGNS");
    if (result?.success) setUserDesigns(result?.data);
  }

  useEffect(() => {
    fetchSubscription();
    fetchDesigns();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-[72px]">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 pt-20">
            <Banner />
            <DesignTypes />
            <AiFeatures />
            <RecentDesigns />
          </main>
        </div>
        <SubscriptionModal
          isOpen={showPremiumModal}
          onClose={setShowPremiumModal}
        />
      </div>
    </>
  );
}
