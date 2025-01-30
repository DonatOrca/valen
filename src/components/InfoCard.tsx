
function Card({ title, content, color, icon_properties, rounded }: { title: String, content: String, color: String, icon_properties: {font_awesome: String, color: String}, rounded?: String}) {
    return (
        <div className={`p-4 ${rounded} shadow-lg flex flex-col items-center w-full max-w-sm mx-auto h-full`} style={{backgroundColor: "rgb(255, 255, 255)"}}>
            <i className={`${icon_properties.font_awesome} ${icon_properties.color} text-4xl`}></i>
            <hr className="border-gray-300 w-1/2 my-2" />
            <h1 className="font-extrabold text-sm sm:text-sm md:text-lg my-1">{title}</h1>
                <p className={`text-xs md:text-sm ${color}`}>{content}</p>
            </div>
    )
}

export default Card;