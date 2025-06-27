"use client";

import { Fragment, useEffect } from "react";
import MainEditor from "@/components/editor";
import { useEditorStore } from "@/store";
import { getUserSubscription } from "@/services/subscription-service";
import { getUserDesigns } from "@/services/design-service";

export default function EditorPage() {
  const { setUserSubscription, setUserDesigns } = useEditorStore();

  const fetchUserSubscription = async () => {
    const response = await getUserSubscription();

    if (response.success) setUserSubscription(response.data);
  };

  async function fetchUserDesigns() {
    const result = await getUserDesigns();

    if (result?.success) setUserDesigns(result?.data);
  }

  useEffect(() => {
    fetchUserSubscription();
    fetchUserDesigns();
  }, []);

  return (
    <Fragment>
      <MainEditor />
    </Fragment>
  );
}
