import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Filters from "../../components/Filters";
import ProductsList from "../../components/ProductsList";

export default function ProductList() {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/api/products/`
      );

      const sortedProducts = response.data.sort((a, b) => a.id - b.id);
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  const handleDelete = async (productId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Unauthorized: Please login.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          await axios.delete(
            `http://127.0.0.1:8000/api/products/crud/products/${productId}/`,
            config
          );
          setProducts(products.filter((product) => product.id !== productId));

          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product", error);
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  const handleEdit = (productId) => {
    navigate(`edit/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
    console.log("Component Mounted");
  }, []);

  return (
    <div className="wrapper py-8">
      {isAdmin && (
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xs shadow-md transition duration-300 cursor-pointer"
            onClick={() => navigate("/products/create")}>
            Create New Product
          </button>
        </div>
      )}
      <div className="flex justify-between items-start gap-6">
        <div className="w-1/4">
          <Filters collectionTitle="All Products" setProducts={setProducts} />
        </div>

        <div className="w-3/4 flex flex-wrap gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="w-[calc(33%-12px)]">
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <h2 className="w-full text-3xl font-medium text-center justify-self-center mt-32">
              There are no search results.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
