"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import RoleListing from "@/app/components/apps/roles/RoleListing";
import ChildCard from "@/app/components/shared/ChildCard";
import { useState } from "react";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Roles",
  },
];

const RolesList = () => {
  const [toggleModal, setToggleModal] = useState(false);

  const onActionButtonClick = () => setToggleModal(!toggleModal);

  return (
    <PageContainer title="Roles" description="this is Roles">
      <Breadcrumb
        title="Roles"
        items={BCrumb}
        showActionButton
        onActionButtonClick={onActionButtonClick}
        actionButtonText="Add New Role"
      />
      <ChildCard>
        <RoleListing
          toggleModal={toggleModal}
          onActionButtonClick={onActionButtonClick}
        />
      </ChildCard>
    </PageContainer>
  );
};

export default RolesList;
