"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ConsultationRequestsListing from "@/app/components/apps/eventRequests/eventRequestsListing";
import ChildCard from "@/app/components/shared/ChildCard";
import { useState } from "react";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "ConsultationRequests",
  },
];

const ConsultationRequestsList = () => {
  const [toggleModal, setToggleModal] = useState(false);

  const onActionButtonClick = () => setToggleModal(!toggleModal);

  return (
    <PageContainer title="Pages" description="this is Consultation Request">
      <Breadcrumb
        title="ConsultationRequests"
        items={BCrumb}
        showActionButton
        onActionButtonClick={onActionButtonClick}
        actionButtonText="Add New Consultation Request"
      />
      <ChildCard>
        <ConsultationRequestsListing
          toggleModal={toggleModal}
          onActionButtonClick={onActionButtonClick}
        />
      </ChildCard>
    </PageContainer>
  );
};

export default ConsultationRequestsList;
