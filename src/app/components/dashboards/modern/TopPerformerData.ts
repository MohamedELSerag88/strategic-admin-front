interface PerformerType {
  id: string;
  imgsrc: string;
  name: string;
  post: string;
  pname: string;
  camera: string;
  budget: string;
}

const TopPerformerData: PerformerType[] = [
  {
    id: "1",
    imgsrc: "/images/profile/user-5.jpg",
    name: "Client",
    post: "Client",
    pname: "Roshan",
    camera: "Z01-A01-C01",
    budget: "45",
  },
  {
    id: "2",
    imgsrc: "/images/profile/user-2.jpg",
    name: "Client",
    post: "Client",
    pname: "Project",
    camera: "Z01-A01-C02",
    budget: "43",
  },
  {
    id: "3",
    imgsrc: "/images/profile/user-3.jpg",
    name: "Client",
    post: "Client",
    pname: "Project Test",
    camera: "Z01-A01-C02",
    budget: "40",
  },
  {
    id: "4",
    imgsrc: "/images/profile/user-4.jpg",
    name: "Client",
    post: "Client",
    pname: "Project data",
    camera: "Z01-A01-C03",
    budget: "30",
  },
];

export default TopPerformerData;
