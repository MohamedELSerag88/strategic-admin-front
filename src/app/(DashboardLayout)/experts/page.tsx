"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ExpertListing from "@/app/components/apps/experts/ExpertListing";
import ChildCard from "@/app/components/shared/ChildCard";
import { useState } from "react";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Categories",
  },
];

const ExpertsList = () => {
  const [toggleModal, setToggleModal] = useState(false);

  const onActionButtonClick = () => setToggleModal(!toggleModal);

  return (
    <PageContainer title="Pages" description="this is Expert">
      <Breadcrumb
        title="Categories"
        items={BCrumb}
        showActionButton
        onActionButtonClick={onActionButtonClick}
        actionButtonText="Add New Expert"
      />
      <ChildCard>
        <ExpertListing
          toggleModal={toggleModal}
          onActionButtonClick={onActionButtonClick}
        />
      </ChildCard>
    </PageContainer>
  );
};

export default ExpertsList;
