export const fourSections = defineComponent({
  props: {
    title: String,
    l1: Boolean,
    l2: Boolean,
    w1: Boolean,
    w2: Boolean,
    disable: {
      default: { l1: false, l2: false, w1: false, w2: false },
      type: Object,
    },
  },
  setup(props, { emit }) {
    const { l1, l2, w1, w2 } = useVModels(props, emit)
    const ids = [
      (+new Date()).toString(),
      (+new Date()).toString(),
      (+new Date()).toString(),
      (+new Date()).toString(),
    ]

    const toggleAll = computed<boolean>({
      get: () => l1.value && l2.value && w1.value && w2.value,
      set(value) {
        if (!props.disable.l1) l1.value = value
        if (!props.disable.l2) l2.value = value
        if (!props.disable.w1) w1.value = value
        if (!props.disable.w2) w2.value = value
      },
    })

    return () => (
      <div class="dark:border-white dark:border-opacity-20 dark:hover:border-opacity-80 flex flex-col items-center rounded-md border border-slate-800 p-2">
        <div class="flex flex-row items-center gap-x-2">
          <input
            value={toggleAll.value}
            checked={toggleAll.value}
            type="checkbox"
            onChange={() => (toggleAll.value = !toggleAll.value)}
            disabled={
              props.disable.l1 &&
              props.disable.l2 &&
              props.disable.w1 &&
              props.disable.w2
            }
          />
          <small>{props.title}</small>
        </div>
        <div class="my-2 flex flex-row items-center justify-center gap-x-2">
          <div class="flex w-5 flex-col items-center gap-y-1">
            <label for={ids[0]}>L1</label>
            <input
              value={l1.value}
              checked={l1.value}
              onChange={() => (l1.value = !l1.value)}
              type="checkbox"
              disabled={props.disable.l1}
            />
          </div>
          <div class="flex w-5 flex-col items-center gap-y-1">
            <label for={ids[1]}>L2</label>
            <input
              value={l2.value}
              checked={l2.value}
              onChange={() => (l2.value = !l2.value)}
              type="checkbox"
              disabled={props.disable.l2}
            />
          </div>
          <div class="flex w-5 flex-col items-center gap-y-1">
            <label for={ids[2]}>W1</label>
            <input
              value={w1.value}
              checked={w1.value}
              onChange={() => (w1.value = !w1.value)}
              type="checkbox"
              disabled={props.disable.w1}
            />
          </div>
          <div class="flex w-5 flex-col items-center gap-y-1">
            <label for={ids[3]}>W2</label>
            <input
              value={w2.value}
              checked={w2.value}
              onChange={() => (w2.value = !w2.value)}
              type="checkbox"
              disabled={props.disable.w2}
            />
          </div>
        </div>
      </div>
    )
  },
})

export const twoSections = defineComponent({
  props: {
    title: String,
    l: Boolean,
    w: Boolean,
    disable: { default: { l: false, w: false }, type: Object },
  },
  setup(props, { emit }) {
    const { l, w } = useVModels(props, emit)
    const ids = [(+new Date()).toString(), (+new Date()).toString()]

    const toggleAll = computed<boolean>({
      get: () => l.value && w.value,
      set(value) {
        if (!props.disable.l) l.value = value
        if (!props.disable.w) w.value = value
      },
    })

    return () => (
      <div class="hover:border-opacity-100 dark:border-white dark:border-opacity-20 dark:hover:border-opacity-80 flex flex-col items-center rounded-md border border-gray-600 border-opacity-30 p-2">
        <div class="flex flex-row items-center gap-x-2">
          <input
            value={toggleAll.value}
            checked={toggleAll.value}
            type="checkbox"
            onChange={() => (toggleAll.value = !toggleAll.value)}
            disabled={props.disable.l && props.disable.w}
          />
          <small>{props.title}</small>
        </div>
        <div class="my-2 flex flex-row items-center justify-center gap-x-2">
          <div class="flex w-5 flex-col items-center gap-y-1">
            <label for={ids[0]}>L</label>
            <input
              value={l.value}
              checked={l.value}
              onChange={() => (l.value = !l.value)}
              type="checkbox"
              disabled={props.disable.l}
            />
          </div>
          <div class="flex w-5 flex-col items-center gap-y-1">
            <label for={ids[1]}>W</label>
            <input
              value={w.value}
              checked={w.value}
              onChange={() => (w.value = !w.value)}
              type="checkbox"
              disabled={props.disable.w}
            />
          </div>
        </div>
      </div>
    )
  },
})
