import { observable, action } from 'mobx';

class orderStore {

    @observable test_store = '';

    @action
    setTestStore(value) {
        this.test_store = value;
    }
}

const store = new orderStore();

export default store;
