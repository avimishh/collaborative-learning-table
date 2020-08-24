class Player {
    constructor(socket, id, name) {
        this.socket = socket;
        this.id = id;
        this.name = name;
        this.stats = null;
    }

    send_Init_Message_To_Client(text){
        this.socket.emit('init_msg', text);   // DEBUG
    }

    set_Player_Role_To_Client(role){
        this.socket.emit('set_player_role', role);
    }

    send_Message_To_Client(type, text){
        this.socket.emit(type, text);   // DEBUG
    }


    set_Player_Stat(stats){
        this.stats = stats;
    }


    set_Operators_State(state){
        // console.log('at set_Operators_State()');
        this.socket.emit('disableOperators', state);
    }

    update_Client_Stats(data){
        this.socket.emit('stats', data)
    }
}

module.exports.Player = Player;