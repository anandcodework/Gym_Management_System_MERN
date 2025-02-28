

import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { Heading, Subscription,Loader } from '../../components';
import {toast} from "react-hot-toast";
import { userImg } from '../../images';
import { BASE_URL } from '../../utils/fetchData';
import { useAuth } from '../../context/auth';



const PlanDetail = () => {
  const [allUserSubscription, setAllUserSubscription] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();

  const getAllUserSubscription = async () => {
  
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/auth/get-all-user-plan`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Include the token here
          }
        }
      );
      if (res.data && res.data.success) {
        console.log(res.data.subscription);
        console.log(res.data);
        setAllUserSubscription(res.data.subscription);
      }
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      toast.error("something went wrong in getting all subscription");
      setLoading(false);
    }
  
  }



  useEffect(() => {
    
    getAllUserSubscription();
  },[])


  if(!allUserSubscription){
    return <h1 className=' text-3xl sm:text-5xl text-white flex justify-center items-center h-screen'>No Plan Choosen</h1>
  }

  if(loading){
    return <Loader/>
  }

  return (
    <section className='pt-10 bg-gray-900'>
    <Heading name="Current User Plan"/>
    <div className="container mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {allUserSubscription.map((u,i) =>(
          <Subscription userImg={userImg} userName={u.userName} planName={u.plan.planName} planAmount={u.planAmount} planType={u.planType} i={i} key={i} createdAt={u.createdAt} planid={u.plan._id}/>
        ))}
      </div>
    </div>
  </section>
  )
}

export default PlanDetail;


