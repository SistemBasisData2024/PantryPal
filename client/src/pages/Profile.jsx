import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for react-modal

export default function Profile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get('/user', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log(response.data);
        setProfile(response.data.rows[0]);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) {
      getProfile();
    }
  }, [user]);

  const handleTopUp = async () => {
    try {
      const response = await axios.put(
        '/user/topup',
        { top_up: topUpAmount },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        balance: response.data.newBalance,
      }));
      toast.success('Balance topped up successfully!');
      setIsModalOpen(false);
      setTopUpAmount('');
    } catch (error) {
      toast.error('Failed to top up balance.');
    }
  };

  const style = 'font-bold w-32 h-10';
  return (
    <div className='flex items-center justify-center'>
      <div className='p-10 border rounded-md w-full'>
        <table>
          <tbody>
            <tr>
              <td className={style}>Name</td>
              <td>{profile.name}</td>
            </tr>
            <tr>
              <td className={style}>Email</td>
              <td>{profile.email}</td>
            </tr>
            <tr>
              <td className={style}>Role</td>
              <td>{profile.role}</td>
            </tr>
          </tbody>
        </table>
        <div className='border rounded-lg p-5 mt-10 flex flex-col items-center justify-center'>
          <h2 className='font-bold text-lg mb-3'>Current Balance</h2>
          <p className='font-bold text-3xl text-blue-500'>Rp{profile.balance}</p>
          <button
            className='px-10 py-1 mt-3 bg-blue-500 text-white rounded-lg'
            onClick={() => setIsModalOpen(true)}
          >
            Top Up
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel='Top Up Modal'
        className='modal'
        overlayClassName='overlay'
      >
        <h2 className='font-bold text-lg mb-3'>Top Up Balance</h2>
        <input
          type='number'
          className='border rounded-lg w-full p-2 mb-3'
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
          placeholder='Enter amount'
        />
        <button
          className='px-10 py-1 mt-3 bg-blue-500 text-white rounded-lg'
          onClick={handleTopUp}
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}
