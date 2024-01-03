import { usePage } from '@inertiajs/vue3'
import { createFetch } from '@vueuse/core'

const networkFetchClient = createFetch({
  baseUrl: import.meta.env.BASE_URL,
  combination: 'chain',
  options: {
    beforeFetch({ options, cancel }) {
      let userToken = usePage<{ auth: any }>().props.auth.token
      if (!userToken) cancel()
      options.headers = {
        ...options.headers,
        Authorization: userToken,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': useCsrf || 'no-token',
      }
      return {
        options,
      }
    },
    afterFetch(ctx) {
      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

class FetchClient {
  networkClient: typeof networkFetchClient

  constructor(networkClient: typeof networkFetchClient) {
    this.networkClient = networkClient
  }

  get<T>(url: string) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx,
    })
      .get()
      .json<T>()
  }

  delete<T>(url: string) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx,
    })
      .delete()
      .json<T>()
  }

  post<T>(url: string, body?: unknown) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx,
    })
      .post(body)
      .json<T>()
  }

  patch<T>(url: string, body?: unknown) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx,
    })
      .patch(body)
      .json<T>()
  }
}

export const useFetchClient = new FetchClient(networkFetchClient)
