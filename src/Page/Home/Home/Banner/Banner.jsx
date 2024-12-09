import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import slider1 from "../../../../assets/Banner/b.png";

const Banner = () => {
    return (
        <div className='my-3 mx-3 flex gap-3 '>
            <div className='w-[75%]'>
                <Carousel autoPlay infiniteLoop showThumbs={false} interval={3000}>
                    <div>
                        <img src={slider1} alt="Slide 1" className='h-[450px]' />
                    </div>
                    <div>
                        <img src={slider1} alt="Slide 2" className='h-[450px]' />
                    </div>
                    <div>
                        <img src={slider1} alt="Slide 3" className='h-[450px]' />
                    </div>
                </Carousel>
            </div>
            <div className='w-[25%] '>
                <div className='mb-3'>
                    <img src={slider1} alt="Slide 3"  className='h-[219px]'/>
                </div>
                <div>
                    <img src={slider1} alt="Slide 3"  className='h-[219px]'/>
                </div>

            </div>

        </div>
    );
};

export default Banner;
