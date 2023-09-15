import { gql, useQuery } from "@apollo/client";
import { centsToDollars } from "@/utils/centsToDollars";
import { useRouter } from "next/router";

import Image from "next/image";
import Loader from "@/components/Loader";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";


const GET_RESTAURANT_DISHES = gql`
  query ($id: ID!) {
    restaurant(id: $id) {
      data {
        id
        attributes {
          name
          dishes {
            data {
              id
              attributes {
                name
                description
                price
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function DishCard({ data }) {
  const { addItem, setShowCart } = useAppContext();
    // will add some logic here

    function handleAddItem() {
      addItem(data);
      setShowCart(true);
    }
  

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="h-full bg-gray-100 rounded-2xl place-card-bg">
        <Image
          className="w-full rounded-2xl"
          height={300}
          width={300}
          src={`${process.env.STRAPI_URL || ""}${
            data.attributes.image.data.attributes.url
          }`}
          alt="dish image"
        />
        <div className="p-8">
          <div className="group inline-block mb-4" href="#">
            <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
              {data.attributes.name}
            </h3>
            <h2 className="price">${(data.attributes.price)}</h2>
          </div>
          <p className="text-sm text-gray-500 font-bold">
            {data.attributes.description}
          </p>
          <div className="flex flex-wrap md:justify-center -m-2">
            <div className="w-full md:w-auto p-2 my-6">
              <button
                className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                onClick={handleAddItem}
              >
                + Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Restaurant() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: router.query.id },
  });
  const [searchQuery, setSearchQuery] = useState("");

  if (error) return "Error Loading Dishes";
  if (loading) return <Loader />;
  if (data.restaurant.data.attributes.dishes.data.length) {
    const { restaurant } = data;
    const dishesData = restaurant.data.attributes.dishes.data;

    const dishesSearchQuery =
      data.restaurant.data.attributes.dishes.data.filter((query) =>
        query.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
      <div className="py-6">
        <h1 className="text-4xl font-bold rest-name">
          {restaurant.data.attributes.name}
        </h1>
        <div className="my-6">
          <input
            className="appearance-none block w-full p-3 leading-5 text-coolGray-900 border border-coolGray-200 rounded-lg shadow-md placeholder-coolGray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            type="text"
            placeholder="Search dishes"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {dishesSearchQuery.length ? (
          
          <div className="py-16 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap -m-4 mb-6">
                {dishesSearchQuery.map((res) => {
                  return <DishCard key={res.id} data={res} />;
                })}
              </div>
            </div>
          </div>
        ) : (
          <h1>No Dishes Found</h1>
        )}
      </div>
    );
  }
}

