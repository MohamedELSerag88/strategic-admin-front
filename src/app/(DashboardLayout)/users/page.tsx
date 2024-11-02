"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import UserListing from "@/app/components/apps/users/UserListing";
import ChildCard from "@/app/components/shared/ChildCard";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Users",
  },
];

const UsersList = () => {
  return (
    <PageContainer title="Users" description="this is Users">
      <Breadcrumb title="Users" items={BCrumb} />
      <ChildCard>
        <UserListing />
      </ChildCard>
    </PageContainer>
  );
};

export default UsersList;
