import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const url = "http://localhost:8000/auth/";

export const Movie = ({ JWT }) => {
  const [name, setName] = useState({});
  const jwt = JWT;
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    axios
      .get(`${url}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setName(response.data);
      });
  };
  const { movie_name } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [ottData, setottData] = useState([]);
  const [castData, setcastData] = useState([]);
  const [imgData, setimgData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  // const [review, setReview] = useState("");
  // const [reviews,setReviews] = useState([])
  // const [s,setS] = useState(a);
  // useEffect(() => {
  //     setMovieData(null);
  //     axios.get(`http://127.0.0.1:8000/api/m/${movie_name}`).then((res) => {
  //         console.log(res.data);
  //         setMovieData(res.data);
  //     })
  //     axios.get(`http://127.0.0.1:8000/api/ott/${movie_name}`).then((ottRes) => {
  //         console.log(ottRes.data);
  //         setottData(ottRes.data);
  //     });
  //     axios.get(`http://127.0.0.1:8000/api/cast/${movie_name}`).then((castRes) => {
  //         console.log(castRes.data);
  //         setcastData(castRes.data);
  //     });
  //     axios.get(`http://127.0.0.1:8000/api/photos/${movie_name}`).then((imgRes) => {
  //         console.log(imgRes.data);
  //         setimgData(imgRes.data);
  //     });
  // }, [movie_name]);
  useEffect(() => {
    if (movie_name != null) {
      fetchMovieData();
      fetchReviews();
    }
  }, [movie_name]);

  const fetchMovieData = () => {
    axios.get(`http://127.0.0.1:8000/api/m/${movie_name}`).then((res) => {
      setMovieData(res.data);
    });
    axios.get(`http://127.0.0.1:8000/api/ott/${movie_name}`).then((ottRes) => {
      setottData(ottRes.data);
    });
    axios
      .get(`http://127.0.0.1:8000/api/cast/${movie_name}`)
      .then((castRes) => {
        setcastData(castRes.data);
      });
    axios
      .get(`http://127.0.0.1:8000/api/photos/${movie_name}`)
      .then((imgRes) => {
        setimgData(imgRes.data);
      });
  };

  const fetchReviews = () => {
    axios.get(`http://127.0.0.1:8000/api/reviews/${movie_name}`).then((res) => {
      setReviews(res.data);
    });
  };

  const submitReview = () => {
    axios
      .post(`http://127.0.0.1:8000/api/reviews/${movie_name}`, {
        review: newReview,
        jwt: jwt,
      })
      .then((res) => {
        fetchReviews(); // Refresh reviews after submission
        setNewReview(""); // Clear input field
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        // Handle error
      });
  };

  return movieData != null ? (
    <main className="h-screen overflow-y-auto">
      <main className="text-white bg-bgr bg-fixed">
        <section className="flex px-16">
          <div>
            <img
              src={movieData.poster}
              alt=""
              className="fixed ml-[130px] mt-[60px] w-[300px] h-[425px] top-10"
            />
          </div>
        </section>

        {ottData.length != null ? (
          <section className="px-16">
            <h1 className="fixed text-2xl ml-[130px] mt-[540px] mx-16 px-2 border-l-4 italic font-bold border-red-700">
              Where to Watch
            </h1>
            <ul className="flex fixed mt-[590px] ml-[160px] gap-x-4">
              {ottData.map((val, ind) =>
                val.o_name === "netflix" ? (
                  <li key={ind} className="w-[60px]">
                    <a href={val.o_link}>
                      <img
                        src="https://a.ltrbxd.com/sm/upload/pz/tl/w6/3i/netflix.png?k=2481975daa"
                        alt=""
                        className="w-[60px] h-[60px] p-2 bg-white rounded-[50%]"
                      />
                    </a>
                  </li>
                ) : val.o_name === "amazon-prime-video-us" ? (
                  <li key={ind} className="w-[60px]">
                    <a href={val.o_link}>
                      <img
                        src="https://images.justwatch.com/icon/52449861/s100"
                        alt=""
                        className="w-[60px] h-[60px] p-2 bg-white rounded-[50%]"
                      />
                    </a>
                  </li>
                ) : val.o_name === "apple-tv-us" ? (
                  <li key={ind} className="w-[60px]">
                    <a href={val.o_link}>
                      <img
                        src="https://a.ltrbxd.com/sm/upload/ns/gr/j0/0w/apple-tv.png?k=dd46c8bed7"
                        alt=""
                        className="w-[60px] h-[60px] p-2 bg-white rounded-[50%]"
                      />
                    </a>
                  </li>
                ) : val.o_name === "disney-plus-us" ? (
                  <li key={ind} className="w-[60px]">
                    <a href={val.o_link}>
                      <img
                        src="https://images.justwatch.com/icon/240029443/s100"
                        alt=""
                        className="w-[60px] h-[60px] p-2 bg-white rounded-[50%]"
                      />
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </section>
        ) : null}

        <section className="pb-16 pt-16 px-20 mt-[30px] mr-[100px]">
          <div className="flex flex-col ml-[600px] gap-y-4 ">
            <h1 className="font-bold text-3xl">{movieData.m_name}</h1>
            <strong className="text-2xl px-2 border-l-4 italic font-bold border-red-700">
              Synopsis
            </strong>
            <span className="mx-4">{movieData.synopsis}</span>
          </div>

          <section>
            <h1 className="text-2xl ml-[600px] mt-12 mx-16 px-2 border-l-4 italic font-bold border-red-700">
              Details
            </h1>
            <div className="pt-8 px-20">
              <ul className="flex flex-col ml-[540px] gap-y-1">
                {movieData.director ? (
                  <li>
                    <strong>Director :</strong> {movieData.director}
                  </li>
                ) : null}
                {movieData.distributor ? (
                  <li>
                    <strong>Distributor :</strong> {movieData.distributor}
                  </li>
                ) : null}
                {movieData.genre ? (
                  <li>
                    <strong>Genre:</strong> {movieData.genre}
                  </li>
                ) : null}
                {movieData.original_language ? (
                  <li>
                    <strong>Original Language:</strong>{" "}
                    {movieData.original_language}
                  </li>
                ) : null}
                {movieData.producer ? (
                  <li>
                    <strong>Producer:</strong> {movieData.producer}
                  </li>
                ) : null}
                {movieData.production_co ? (
                  <li>
                    <strong>Production Co:</strong> {movieData.production_co}
                  </li>
                ) : null}
                {movieData.release_date ? (
                  <li>
                    <strong>Release Date (Theaters):</strong>{" "}
                    {movieData.release_date}
                  </li>
                ) : null}
                {movieData.runtime ? (
                  <li>
                    <strong>Runtime:</strong> {movieData.runtime}
                  </li>
                ) : null}
                {movieData.writer ? (
                  <li>
                    <strong>Writer:</strong> {movieData.writer}
                  </li>
                ) : null}
              </ul>
            </div>

            {castData.length ? (
              <section>
                <h1 className="text-2xl ml-[600px] mt-12 mx-16 px-2 border-l-4 italic font-bold border-red-700">
                  Cast & Crew
                </h1>
                <div className="pt-8 pb-">
                  <ul className="ml-[640px] mx-29 mb-2 flex overflow-auto gap-x-4 no-scrollbar">
                    {castData.map((val, ind) => (
                      <li key={ind} className="">
                        <img
                          src={val.c_link}
                          alt=""
                          className="min-w-[150px] max-w-[150px]"
                          onError={(event) => {
                            (event.target.src =
                              "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="),
                              (event.onerror = null);
                          }}
                        />
                        <label className="text-xl font-bold mt-2">
                          {val.c_name}
                        </label>
                        <br></br>
                        <span className="text-white">{val.c_role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {imgData.length ? (
              <section>
                <h1 className="text-2xl ml-[600px] mt-12 mx-16 px-2 border-l-4 italic font-bold border-red-700">
                  {movieData.m_name} photos
                </h1>
                <div className="pt-8">
                  <ul className="ml-[640px] mx-29 flex overflow-auto gap-x-4 no-scrollbar">
                    {imgData.map((val, ind) => (
                      <li key={ind} className="flex items-center">
                        <img
                          src={val.m_image}
                          alt=""
                          className="min-w-[150px] max-w-[150px]"
                          onError={(event) => {
                            (event.target.src =
                              "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="),
                              (event.onerror = null);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}
          </section>

          <section className="pb-16 pt-16 px-20 mt-[30px] mr-[100px]">
            <strong className="text-2xl ml-[520px] mt-12 mx-16 px-2 border-l-4 italic font-bold border-red-700">
              Add a Review
            </strong>
            <div className="flex flex-col items-center mt-12">
              <input
                className="w-[500px] ml-[580px] bg-transparent backdrop-blur-xl p-3 rounded-lg text-xl outline-none text-white placeholder-gray-400 border border-white"
                placeholder="Add Review"
                type="text"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                className="mt-4 ml-[230px] mb-10 bg-[#B90000] hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors duration-300"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>

            <strong className="text-2xl ml-[520px] mx-16 px-2 border-l-4 italic font-bold border-red-700">
              Reviews
            </strong>
            <ul>
              {reviews.map((review, index) => (
                <li
                  key={index}
                  className="ml-[540px] mt-12 mx-16 w-[500px] bg-[rgba(255,255,255,0.25)] backdrop-blur-xl p-4 rounded-lg text-xl outline-none text-white"
                >
                  {review.review} : {review.user_name}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    </main>
  ) : (
    <h1>Loading...</h1>
  );
};
