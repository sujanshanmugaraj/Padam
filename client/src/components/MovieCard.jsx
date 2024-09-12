export const MovieCard = ({ image, name }) => {
  return (
    <div className="bg-[rgba(0,0,0,0.65)] flex flex-col hover:no-underline justify-center items-center max-w-[10vw] rounded-lg min-h-[30vh] transition ease-in-out delay-150 hover:scale-110">
      <img 
        src={image} 
        alt={name} 
        className="w-[10vw] rounded-t-lg" 
        onError={event => {
          event.target.src = "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="
          event.onerror = null
        }}
      />
      <h1 className="text-white text-lg text-center no-underline hover:no-underline py-3 px-2">
        {name}
      </h1>
    </div>
  );
}
