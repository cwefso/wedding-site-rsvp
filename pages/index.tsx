import { useState, FormEvent } from "react";

interface FormData {
  name: string;
  attending: boolean;
  number_of_guests: number;
  message: string;
}

const Home: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    attending: false,
    number_of_guests: 1,
    message: "",
  });
  const [rsvpComplete, setRsvpComplete] = useState<boolean>(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox" && event.target instanceof HTMLInputElement) {
      const { checked } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://flask-basic-backend.onrender.com/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setRsvpComplete(true);
      } else {
        alert(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      {rsvpComplete ? (
        <>
          {" "}
          <h1 className="text-2xl font-bold mb-4">Thank you!</h1>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">RSVP Form</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-black"
          >
            <label className="flex flex-col">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded"
                required
              />
            </label>

            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                name="attending"
                checked={formData.attending}
                onChange={handleInputChange}
              />
              Attending?
            </label>

            <label className="flex flex-col">
              Number of Guests:
              <input
                type="number"
                name="number_of_guests"
                value={formData.number_of_guests}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded"
                min="1"
                required
              />
            </label>

            <label className="flex flex-col">
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded"
              />
            </label>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Home;
