import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "./UseAxiosSecure";

const UseCart = () => {
    const { user } = useContext(AuthContext);  
    const axiosSecure = useAxiosSecure();

    const { refetch, data: cart = [] } = useQuery({
        queryKey: ['carts', user?.email],  
        queryFn: async () => {
            if (!user?.email) return [];  

            const res = await axiosSecure.get(`/carts?email=${user.email}`);  
            return res.data;
        },
        enabled: !!user?.email,  
    });

    return [cart, refetch];
};

export default UseCart;
