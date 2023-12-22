import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/helper/supabaseClient";

export default function DetailBook({ user }) {
  const CDNURL = "https://pnjolpsznjbefwhxrhds.supabase.co/storage/v1/object/public/book-cover/";
  const params = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  // Function
  const getData = async () => {
    try {
      const { data } = await supabase.from("Books").select("*").eq("user_id", user.id).eq("slug", params.slug).single();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (isConfirmed) {
      try {
        const { error } = await supabase.from("Books").delete().eq("user_id", user.id).eq("slug", data.slug);

        if (error) {
          throw error;
        }

        const { error: storageError } = await supabase.storage.from("book-cover").remove([`${user.id}/${data.thumbnail}`]);

        if (storageError) {
          throw storageError;
        }
        navigate("/books");
      } catch (error) {
        throw error;
      }
    }
    return;
  };

  useEffect(() => {
    getData();
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <img className="w-full" src={CDNURL + user.id + "/" + data.thumbnail} alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{data.title}</div>
          <p className="text-gray-700 text-base my-1">Many Pages: {data.many_pages}</p>
          <p className="text-gray-700 text-base">Page Read: {data.page_read}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <Link to={"/books/edit/" + data.slug}>
            <span className="inline-block bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Update</span>
          </Link>
          <button onClick={handleDelete}>
            <span className="inline-block bg-red-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
