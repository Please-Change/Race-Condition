export function* filter<T, R>(gen: Iterable<T>, pred: (_: T) => boolean) {
  for (const item of gen) {
    if (pred(item))
      yield item;
  }
}

export function* map<T1, T2, R>(gen: Iterable<T1>, mapper: (_: T1) => T2) {
  for (const item of gen) {
    yield mapper(item);
  }
}

export function* join<T, R>(...gens: Iterable<T>[]) {
  for (const gen of gens){
    for (const item of gen) {
      yield item;
    }
  }
}

export function* flatten<T, R>(gen: Iterable<T[] | T | undefined | null>) {
  for (const item of gen) {
    if (Array.isArray(item)) yield* item;
    else if (item != undefined) yield item;
  }
}