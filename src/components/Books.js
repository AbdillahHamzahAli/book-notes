import React, { useState, useEffect } from "react";
import { supabase } from "../lib/helper/supabaseClient";

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
      <div>
        <h1>React with Supabase Policy</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Judul:
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Thumbnail:
            <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Jumlah Halaman:
            <input type="number" name="many_pages" value={formData.many_pages} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Halaman yang Dibaca:
            <input type="number" name="page_read" value={formData.page_read} onChange={handleInputChange} />
          </label>
          <br />
          <button type="submit">Kirim</button>
        </form>
        {error && <pre>{error.message}</pre>}
      </div>
      <div>
        <h2>Book data</h2>
        <ul>
          {books.map((book, i) => {
            return (
              <li key={i}>
                {book.title} - {book.many_pages} - {book.page_read}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
