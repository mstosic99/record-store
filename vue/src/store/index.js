import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        records: [],
        cart: [],
        sum: 0,
        addresses: [],
        token: '',
        orders: [],
        admin: 0
    },
    mutations: {
        set_records: function(state, records) {
            state.records = records;
        },
        add_record: function(state, record) {
            state.record.push(record);
        },
        remove_record: function(state, id) {
            for (let m = 0; m < state.records.length; m++) {
                if (state.records[m].id === id) {
                    state.records.splice(m, 1);
                    break;
                }
            }
        },
        cart: function(state, record) {
            const _ = require('lodash');

            var exists = -1;
            for (var i = 0; i < state.cart.length; i++) {
                if (state.cart[i].record_id == record.record_id) {
                    exists = i;
                    break;
                }
            }
            if (exists == -1) {
                var copyRecord = _.cloneDeep(record);
                copyRecord.stock = 1;
                state.cart.push(copyRecord);
            } else {
                state.cart[i].stock += 1;
            }

            state.sum += state.cart[i].price;

        },
        clear_cart: function(state) {
            state.cart.splice(0, this.state.cart.length);
            this.state.sum = 0;
        },
        logout: function(state) {
            this.state.token = '';
            this.state.cart = [];
            this.state.address = [];
            this.sum = 0;
            this.orders = []
        },
        set_addresses: function(state, addresses) {
            state.addresses = addresses;
        },
        append_address: function(state, address) {
            this.state.addresses.push(address);
        },
        set_orders: function(state, orders) {
            state.orders = orders;
        },
        set_admin(state, isAdmin) {
            state.admin = isAdmin.admin;
        }
    },
    actions: {
        load_records: function({ commit }) {
            fetch('http://localhost:8080/api/records', { method: 'get' }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json()
            }).then((jsonData) => {
                commit('set_records', jsonData)
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        new_record: function({ commit }, record) {
            fetch('http://localhost:8080/api/records', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: record
            }).then((response) => {
                if (!response.ok)
                    throw response;

                return response.json();
            }).then((jsonData) => {
                commit('add_record', jsonData);
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        search_record_by_title: function({ commit }, title) {
            console.log(title);
            fetch('http://localhost:8080/api/records/' + title, { method: 'get' }).then((response) => {
                if (!response.ok)
                    throw response;

                return response.json()
            }).then((jsonData) => {
                commit('set_records', jsonData)
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        sort_records: function({ commit }, col) {
            fetch(`http://localhost:8080/api/records/sort/${col}`, { method: 'get' }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json()
            }).then((jsonData) => {
                commit('set_records', jsonData)
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        delete_record: function({ commit }, id) {
            fetch(`http://localhost:8080/api/records/${id}`, { method: 'delete' }).then((response) => {
                if (!response.ok)
                    throw response;

                return response.json()
            }).then((jsonData) => {
                commit('remove_record', jsonData.id)
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        add_to_cart: function({ commit }, record) {
            commit('cart', record);
        },
        place_order: function({ commit }, selectedAddr) {
            const order = JSON.stringify({ cart: this.state.cart, price: this.state.sum, address_id: selectedAddr, token: this.state.token });
            fetch('http://localhost:8080/api/orders', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: order
            }).then((response) => {
                if (!response.ok)
                    throw response;

                return response.json();
            }).then((jsonData) => {
                alert("Thank you for your purchase!");
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        login: function({ commit }, dto) {
            const json = JSON.stringify({ username: dto[0], password: dto[1] });
            fetch('http://localhost:8080/api/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json();
            }).then((jsonData) => {
                if (jsonData.token != '') {
                    this.state.token = jsonData.token;

                }

            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        load_addresses: function({ commit }) {
            const json = JSON.stringify({ token: this.state.token });
            fetch('http://localhost:8080/api/addresses', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json();
            }).then((jsonData) => {
                commit('set_addresses', jsonData);


            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        add_address: function({ commit }, dto) {
            const json = JSON.stringify({ address: dto[0], zipcode: dto[1], token: this.state.token });
            fetch('http://localhost:8080/api/address', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json();
            }).then((jsonData) => {
                alert("Address added!")
                commit('append_address', jsonData);
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        register: function({ commit }, dto) {
            const json = JSON.stringify({ username: dto[0], password: dto[1], email: dto[2], name: dto[3], lastname: dto[4], phone: dto[5] });
            console.log(json);
            fetch('http://localhost:8080/api/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            }).then((response) => {
                if (!response.ok)
                    throw response;

                return response.json();
            }).then((jsonData) => {
                alert("Registered!")
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        load_orders: function({ commit }) {
            const json = JSON.stringify({ token: this.state.token });
            fetch('http://localhost:8080/api/get_orders', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json();
            }).then((jsonData) => {
                commit('set_orders', jsonData);
            }).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        manage_orders: function({ commit }) {
            const json = JSON.stringify({ token: this.state.token });
            fetch('http://localhost:8080/api/manage_orders', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            }).then((response) => {
                if (!response.ok)
                    throw response;
                return response.json();
            }).then((jsonData) => {}).catch((error) => {
                if (typeof error.text === 'function')
                    error.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                else
                    alert(error);
            });
        },
        empty_cart: function({ commit }) {
            commit('clear_cart');
        },
        delete_token: function({ commit }) {
            commit('logout');
        },
        is_admin: function({ commit }) {
            const json = JSON.stringify({ token: this.state.token });
            if (this.state.token) {
                fetch('http://localhost:8080/api/is_admin', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: json
                }).then((response) => {
                    if (!response.ok)
                        throw response;
                    return response.json();
                }).then((jsonData) => {}).catch((error) => {
                    if (typeof error.text === 'function')
                        error.text().then((errorMessage) => {
                            alert(errorMessage);
                        });
                    else
                        alert(error);
                });
            }
        }
    }
})