import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/helper/supabaseClient";

export default function DetailBook({ user }) {
  const CDNURL = "https://pnjolpsznjbefwhxrhds.supabase.co/storage/v1/object/public/book-cover/";

  const [data, setData] = useState({});
  const params = useParams();

  // Function
  const getData = async () => {
    try {
      const { data } = await supabase.from("Books").select("*").eq("user_id", user.id).eq("slug", params.slug).single();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img class="w-full" src={CDNURL + user.id + "/" + data.thumbnail} alt="Sunset in the mountains" />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{data.title}</div>
          <p class="text-gray-700 text-base my-1">Many Pages: {data.many_pages}</p>
          <p class="text-gray-700 text-base">Page Read: {data.page_read}</p>
        </div>
        <div class="px-6 pt-4 pb-2">
          <Link to={"/books/edit/" + data.slug}>
            <span class="inline-block bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Update</span>
          </Link>
          <button>
            <span class="inline-block bg-red-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
