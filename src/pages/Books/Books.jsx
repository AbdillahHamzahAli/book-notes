import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/helper/supabaseClient";
import { Link } from "react-router-dom";

export default function Books({ user }) {
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    many_pages: "",
    page_read: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase
        .from("Books")
        .upsert([{ ...formData, user_id: user.id }])
        .select("*");
      setFormData({
        title: "",
        thumbnail: "",
        many_pages: "",
        page_read: "",
      });
    } catch (error) {
      setError(error);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const getBooks = async () => {
    let { data: Books, error } = await supabase.from("Books").select("*");
    setBooks(Books);
  };
  useEffect(() => {
    getBooks();

    return () => {};
  }, [books, formData]);

  return (
    <div>
      <div className="w-full flex justify-center p-8">
        <h1 className="text-3xl font-bold text-center">Note Books</h1>
      </div>
      <div className="w-full px-12">
        <div className="py-8">
          <div className="flex-grow md:flex items-center justify-between">
            <div className="flex-grow flex-shrink basis-auto">
              <h1 className="font-semibold text-lg">Users</h1>
              <p className="mt-2 text-base">A list of all the users in your account including their name, title, email and role.</p>
            </div>
            <div className="my-2">
              <Link to="/books/create" className="py-2 px-3 text-center text-base bg-blue-500 rounded-md font-bold text-white">
                Add Book
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-12 bg-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative h-full rounded-lg shadow-md overflow-hidden">
              <img src="https://c4.wallpaperflare.com/wallpaper/512/813/273/anime-anime-girls-hd-wallpaper-preview.jpg" alt="Gambar Card" className="w-96 h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-semibold ">Shenhe Genshin</h2>
              </div>
            </div>
            <div className="relative h-full rounded-lg shadow-md overflow-hidden">
              <img src="https://c4.wallpaperflare.com/wallpaper/549/839/634/anime-girls-anime-edit-hd-wallpaper-preview.jpg" alt="Gambar Card" className="w-96 h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-semibold ">Anime Girl</h2>
              </div>
            </div>
            <div className="relative h-full rounded-lg shadow-md overflow-hidden">
              <img src="https://c4.wallpaperflare.com/wallpaper/488/946/398/anime-anime-girls-oshi-no-ko-kurokawa-akane-hd-wallpaper-preview.jpg" alt="Gambar Card" className="w-96 h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-semibold ">Oshi No Kho</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
