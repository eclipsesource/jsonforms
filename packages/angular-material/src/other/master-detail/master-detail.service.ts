export class MasterDetailService {

    private selectedItem: any;

    setSelectedItem(item: any) {
        this.selectedItem = item;
    }

    getSelectedItem() {
        return this.selectedItem;
    }
}