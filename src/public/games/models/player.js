class Player {
    constructor(socket, id, name) {
        this.socket = socket;
        this.id = id;
        this.name = name;
        this.stats = null;
    }

    set_Player_Stat(stats){
        this.stats = stats;
    }

    send_Welcome_Message_To_Client(text){
        this.socket.emit('fromServer_toClient_welcome_msg', text);   // DEBUG
    }

    set_Player_Role_To_Client(role){
        this.socket.emit('fromServer_toClient_set_player_role', role);
    }

    send_Message_To_Client(type, text){
        this.socket.emit(type, text);   // DEBUG
    }

    set_Operators_Frame_State(state){
        this.socket.emit('fromServer_toClient_set_operators_state', state);
    }

    set_Questions_Frame_State(state){
        this.socket.emit('fromServer_toClient_set_question_frame_state', state);
    }

    update_Client_Stats(dataPlayersStatsArray){
        this.socket.emit('fromServer_toClient_updated_stats', dataPlayersStatsArray)
    }
}

module.exports.Player = Player;