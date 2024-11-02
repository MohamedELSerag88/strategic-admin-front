"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import AdminListing from "@/app/components/apps/admins/AdminListing";
import ChildCard from "@/app/components/shared/ChildCard";
import { useState } from "react";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Admins",
  },
];

const AdminsList = () => {
  const [toggleModal, setToggleModal] = useState(false);

  const onActionButtonClick = () => setToggleModal(!toggleModal);

  return (
    <PageContainer title="Admins" description="this is Admins">
      <Breadcrumb
        title="Admins"
        items={BCrumb}
        showActionButton
        onActionButtonClick={onActionButtonClick}
        actionButtonText="Add New Admin"
      />
      <ChildCard>
        <AdminListing
          toggleModal={toggleModal}
          onActionButtonClick={onActionButtonClick}
        />
      </ChildCard>
    </PageContainer>
  );
};

export default AdminsList;
