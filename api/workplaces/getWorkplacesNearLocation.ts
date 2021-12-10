import Workplace from '../../models/Workplace';

/**
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function getWorkplacesNearLocation()
  : Promise<Workplace[]>
{
  return new Promise(resolve => setTimeout(() => resolve([{
    id: 68,
    name: 'Test Workplace',
    address: '123 Fake Street',
  }]), 5000));
}
