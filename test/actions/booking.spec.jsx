import { prepareRequestOptions } from '../../src/actions/booking';

describe('action.booking', () => {
  describe('prepareRequestOptions', () => {
    let exampleState;
    let serializedData;
    const hotelId = '0x111';

    beforeEach(() => {
      window.env = process.env;
      exampleState = {
        hotelId,
        customer: {},
        pricing: {},
        booking: {},
        hotels: {
          list: [
            { id: hotelId, bookingUri: 'example.com' },
          ],
        },
      };
      serializedData = JSON.stringify(exampleState);
    });

    describe('booking', () => {
      it('should prepare message signature headers', async () => {
        const res = await prepareRequestOptions('POST', serializedData);
        expect(res).toStrictEqual({
          method: 'POST',
          body: serializedData,
          headers: {
            'content-type': 'application/json',
            'x-wt-signature': '0xabddde8d5305d81b8ff79da857ee15a041d7eaebcb08d4825525f2bbe5246e185f6795997e8f80a5b0c8d4f11816c5973309ecb555749426f5e781b5a2ee7f021b',
          },
        });
      });

      it('should not sign when configured', async () => {
        const orig = window.env.WT_SIGN_BOOKING_REQUESTS;
        window.env.WT_SIGN_BOOKING_REQUESTS = false;
        try {
          const res = await prepareRequestOptions('POST', serializedData);
          expect(res).toStrictEqual({
            method: 'POST',
            body: serializedData,
            headers: {
              'content-type': 'application/json',
            },
          });
        } finally {
          window.env.WT_SIGN_BOOKING_REQUESTS = orig;
        }
      });

      it('should fail gracefully when eth provider not configured', async () => {
        const orig = window.env.ETH_NETWORK_PROVIDER;
        delete window.env.ETH_NETWORK_PROVIDER;
        try {
          await prepareRequestOptions('POST', serializedData);
          throw new Error('Should\'ve failed');
        } catch (e) {
          expect(e.message).toBe('No ETH_NETWORK_PROVIDER set.');
        } finally {
          window.env.ETH_NETWORK_PROVIDER = orig;
        }
      });
    });

    describe('cancellation', () => {
      const uri = 'https://booking.api/booking/1';

      it('should prepare message signature headers', async () => {
        const res = await prepareRequestOptions('DELETE', uri);
        expect(res).toStrictEqual({
          method: 'DELETE',
          headers: {
            'x-wt-signature': '0x575c53352298cc57a01f6455407b5703e6205d1cc0ae70332de0b8449abc939c763909d9a95069316f95f67b6948975d0326a8921a2a1ad009b29939dcdfb8751c',
            'x-wt-origin-address': '0xD39Ca7d186a37bb6Bf48AE8abFeB4c687dc8F906',
          },
        });
      });

      it('should not sign when configured', async () => {
        const orig = window.env.WT_SIGN_BOOKING_REQUESTS;
        window.env.WT_SIGN_BOOKING_REQUESTS = false;
        try {
          const res = await prepareRequestOptions('DELETE', uri);
          expect(res).toStrictEqual({
            method: 'DELETE',
            headers: {},
          });
        } finally {
          window.env.WT_SIGN_BOOKING_REQUESTS = orig;
        }
      });

      it('should fail gracefully when eth provider not configured', async () => {
        const orig = window.env.ETH_NETWORK_PROVIDER;
        delete window.env.ETH_NETWORK_PROVIDER;
        try {
          await prepareRequestOptions('DELETE', uri);
          throw new Error('Should\'ve failed');
        } catch (e) {
          expect(e.message).toBe('No ETH_NETWORK_PROVIDER set.');
        } finally {
          window.env.ETH_NETWORK_PROVIDER = orig;
        }
      });
    });
  });
});
