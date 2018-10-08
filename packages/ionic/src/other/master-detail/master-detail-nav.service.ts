
import { Nav } from 'ionic-angular';
import { AbstractDetailPage } from './pages/AbstractDetailPage';
import { PlaceholderPage } from './pages/placeholder/placeholder';

export class MasterDetailNavService {

  _masterNav: Nav;
  _detailNav: Nav;
  _parentNav: Nav;
  _isDetailVisible: boolean;
  _isViewChanging = false;
  useParentNav: boolean;

  get masterNav(): Nav {
    return this._masterNav;
  }

  set masterNav(nav: Nav) {
    this._masterNav = nav;
  }

  get detailNav(): Nav {
    return this._detailNav;
  }

  set detailNav(nav: Nav) {
    this._detailNav = nav;
  }

  get parentNav(): Nav {
    return this._parentNav;
  }

  set parentNav(nav: Nav) {
    this._parentNav = nav;
  }

  pushDetail(page: any, params: any) {
    if (this.useParentNav) {
      this.parentNav.push(page, params);
    } else {
      this.detailNav.push(page, params);
    }
  }

  pushMaster(page: any, params: any) {
    this.masterNav.push(page, params);
  }

  onDetailVisibilityChanged(isDetailVisible: boolean, parentNav: Nav) {
    this._isDetailVisible = isDetailVisible;
    if (this.masterNav && this.detailNav) {
      isDetailVisible ? this.showDetail(parentNav) : this.hideDetail(parentNav);
    }
  }

  showDetail(parentNav: Nav): Promise<any> {
    if (this._isViewChanging) {
      return Promise.resolve();
    }

    this._isViewChanging = true;
    // assumes that the master detail is at top
    return parentNav.popToRoot()
      .then(() => {
        this._isViewChanging = false;
        this.useParentNav = false;
      });
  }

  hideDetail(parentNav: Nav): Promise<any> {

    if (this._isViewChanging) {
      return Promise.resolve();
    }
    this._isViewChanging = true;

    const activeMasterView = this.masterNav.getActive();
    const activeDetailView = this.detailNav.getActive();

    if (activeDetailView.component.prototype instanceof AbstractDetailPage) {
      return parentNav.push(activeMasterView.component, activeMasterView.data)
        .then(() => parentNav.push(activeDetailView.component, activeDetailView.data))
        .then(() => {
          this.useParentNav = true;
          this._isViewChanging = false;
        });
    } else if (activeDetailView.component.prototype instanceof PlaceholderPage) {
      return parentNav.push(activeMasterView.component, activeMasterView.data)
        .then(() => {
          this.useParentNav = true;
          this._isViewChanging = false;
        });
    } else {
      this.useParentNav = true;
      this._isViewChanging = false;
    }
  }
}
