import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BecomeTutorForm from '../components/BecomeTutorForm';
import TutorRegistrationProcess from '../components/TutorRegistrationProcess';
import DocumentsRequired from '../components/DocumentsRequired';
import ServiceChargeInfo from '../components/ServiceChargeInfo';

export default function BecomeTutorPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile?.role === 'tutor') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, navigate]);

  return (
    <div className="pt-20">
      <BecomeTutorForm />
      <TutorRegistrationProcess />
      <DocumentsRequired />
      <ServiceChargeInfo />
    </div>
  );
}

