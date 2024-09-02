"use client";
import { Button } from "@/components/ui/button";
import { selectUser } from "@/utils/userSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = useSelector(selectUser);
  const [freelancers, setFreelancers] = useState<Freelancer[] | null>();
  const router = useRouter();

  interface Freelancer {
    id: string;
    name: string;
    professional_title: string;
  }

  const fetchFreelancers = async () => {
    const response = await axios.get("/api/freelancers");
    if (!response) return;
    return setFreelancers(response.data.freelancers);
  };

  useEffect(() => {
    fetchFreelancers(), [];
  }, []);

  const handleProfile = ({ user_id }: { user_id: string }) => {
    router.push(`/f/profile/${user_id}`);
  };

  return (
    <div className=" flex flex-col justify-center items-center gap-5 mt-8">
      <div className=" flex flex-col gap-3 w-2/3  bg-gray-900 bg-opacity-80 border border-gray-800  30 h-full rounded-lg shadow-lg p-4">
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar> */}
        <div>
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <Button variant={"outline"}>Edit</Button>
          </div>
          <div>{user.professional_title}</div>
        </div>
      </div>

      <Tabs defaultValue="freelancers" className="w-1/2 text-white ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
        </TabsList>
        <div className="bg-gray-900 bg-opacity-80 border border-gray-800  my-4  rounded-lg shadow-lg p-4">
          {" "}
          <TabsContent value="freelancers">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 justify-center items-center">
                <Input type="text" placeholder="Search for freelancers" />
                <Button variant={"secondary"}>Search</Button>
              </div>
              <div className="flex gap-4">
                {freelancers &&
                  freelancers.map((freelancer, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <div className="text-xl font-semibold">
                        {freelancer.name}
                      </div>
                      <div>{freelancer.professional_title}</div>
                      <div className="flex justify-between">
                        <div></div>
                        <Button
                          variant={"secondary"}
                          onClick={() => {
                            handleProfile({ user_id: freelancer.id });
                          }}
                          className="border"
                        >
                          <Eye />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div>My reviews</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Page;
