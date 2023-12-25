import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/helper/supabaseClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function UpdateBook({ user }) {
  const CDNURL = "https://pnjolpsznjbefwhxrhds.supabase.co/storage/v1/object/public/book-cover/";
  const params = useParams();
  const navigate = useNavigate();
  const [img, setImg] = useState({
    cover: null,
    url: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    thumbnail: "",
    many_pages: "",
    page_read: "",
    link_book: "",
  });

  const getData = async () => {
    try {
      const { data } = await supabase.from("Books").select("*").eq("user_id", user.id).eq("slug", params.slug).single();
      setImg((prevData) => ({ ...prevData, url: CDNURL + user.id + "/" + data.thumbnail }));
      return setFormData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail" && files.length !== 0) {
      setImg((prevData) => ({ ...prevData, cover: e.target.files[0] }));
      setImg((prevData) => ({ ...prevData, url: URL.createObjectURL(files[0]) }));
    } else if (name !== "thumbnail") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    if (name === "title") {
      generateSlug(value);
    }
  };

  const generateSlug = (title) => {
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z\d-]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prevData) => ({ ...prevData, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.thumbnail) {
      return alert("Kolom title & thumbnail harus diisi");
    }

    try {
      updateImg();
      await supabase
        .from("Books")
        .update([{ ...formData, user_id: user.id }])
        .eq("user_id", user.id)
        .eq("slug", params.slug);
      navigate("/books");
    } catch (error) {
      alert("Error saat mengirim data ke Supabase:", error);
    }
  };

  const updateImg = async () => {
    await supabase.storage.from("book-cover").update(user.id + "/" + formData.thumbnail, img.cover, {
      upsert: true,
      contentType: "image/jpeg",
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto px-8 flex flex-col justify-center h-full">
      <form onSubmit={handleSubmit}>
        <div className="my-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Update Book</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* title */}
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Book Title
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Book Title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              {/* thumbnail */}
              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Cover Book
                </label>
                <div className="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" onClick={() => document.querySelector("#thumbnail").click()}>
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <input id="thumbnail" name="thumbnail" type="file" accept="image/png, image/jpeg" className="sr-only" onChange={handleInputChange} />
                      {img.url ? (
                        <img src={img.url} alt="" className="w-full h-auto  object-cover" />
                      ) : (
                        <div>
                          <p className="py-1">Upload or drag and drop</p>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* many_pages */}
              <div className="sm:col-span-3">
                <label htmlFor="many_pages" className="block text-sm font-medium leading-6 text-gray-900">
                  Many Pages
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="many_pages"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                    value={formData.many_pages}
                  />
                </div>
              </div>
              {/* page_read */}
              <div className="sm:col-span-3">
                <label htmlFor="page_read" className="block text-sm font-medium leading-6 text-gray-900">
                  Page Read
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="page_read"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                    value={formData.page_read}
                  />
                </div>
              </div>
              {/* link */}
              <div className="sm:col-span-4">
                <label htmlFor="link" className="block text-sm font-medium leading-6 text-gray-900">
                  Link File Book
                </label>
                <div className="mt-2">
                  <input
                    name="link_book"
                    type="url"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                    value={formData.link_book}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 flex items-center justify-end gap-x-6">
          <Link to={-1} className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
