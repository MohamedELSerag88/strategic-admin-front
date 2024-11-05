"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import CategoryListing from "@/app/components/apps/categories/CategoryListing";
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

const AdminsList = () => {
  const [toggleModal, setToggleModal] = useState(false);

  const onActionButtonClick = () => setToggleModal(!toggleModal);

  return (
    <PageContainer title="Pages" description="this is Category">
      <Breadcrumb
        title="Categories"
        items={BCrumb}
        showActionButton
        onActionButtonClick={onActionButtonClick}
        actionButtonText="Add New Category"
      />
      <ChildCard>
        <CategoryListing
          toggleModal={toggleModal}
          onActionButtonClick={onActionButtonClick}
        />
      </ChildCard>
    </PageContainer>
  );
};

export default AdminsList;
