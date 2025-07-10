
export default function Banner(){

    return(
      <div className={"relative flex justify-center items-center -mt-[60px] pb-[40px]"}>
        <img
            src={"/public/img/banner.jpg"}
            alt={"futa phuong trang"}
            className={"rounded-[20px] h-[250px] min-w-[1200px] "}
        />
      </div>
    );
}