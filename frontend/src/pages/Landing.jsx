import { useClerk, useUser } from "@clerk/clerk-react";
import { features, pricingPlans, testimonials } from "../assets/data";
import CTASection from "../components/landing/CTASection";
import FeaturesSection from "../components/landing/FeaturesSection";
import FooterSection from "../components/landing/FooterSection";
import HeroSection from "../components/landing/HeroSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () =>{
  const {openSignIn, openSignUp}=useClerk();
  const {isSignedIn}=useUser();
  const navigate=useNavigate();

  useEffect(()=>{
    if(isSignedIn){
      navigate("/dashboard");
    }
  }, [isSignedIn,navigate]);
  return (
    <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section*/}
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp}/>

      {/* Features Section*/}
      <FeaturesSection features={features}/>

      {/* Pricing Section*/}
      <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>
      
      {/* Testimonials Section*/}
      <TestimonialsSection testimonials={testimonials}/>

      {/* Call to Action Section*/}
      <CTASection openSignUp={openSignUp}/>

      {/* Footer Section*/}
      <FooterSection />


    </div>
  )
}

export default Landing;