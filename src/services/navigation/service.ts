// Define an interface for the router
export interface IRouter {
  push: (path: string) => void;
}

export interface INavigationService {
  navigateTo: (path: string) => void;
}

export class NavigationService implements INavigationService {
  constructor(private router: IRouter) { }

  navigateTo(path: string): void {
    this.router.push(path);
  }
}
