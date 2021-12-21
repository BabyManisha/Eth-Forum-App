// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
contract Chitti {
    struct Chit {
        string message;
        address author;
        uint256 likes_count;
        uint256 dislikes_count;
        int256 reply_index;
        uint created;
        uint updated;
    }
    struct Topic{
        address owner;
        string topic;
    }
    mapping(uint=>mapping(uint=>mapping(address => uint256))) reactions;
    mapping(uint=>Chit[]) public topic_chits;
    Topic[] public topics; 

    function getTopic() public view returns(Topic[] memory){
        return topics;
    }
    
    function getChits(uint topic_index) public view returns(Chit[] memory){
        return topic_chits[topic_index];
    }

    function lastIndex(uint topic_index)  public view returns (uint256){
        require(topics.length > topic_index);
        return topic_chits[topic_index].length;
    }

    function newTopic(string memory message) public {
        topics.push(Topic({owner: msg.sender, topic: message}));
    }

    function reactOnChit(uint topic_index, uint chit_index, uint reaction) public{
        require(topics.length > topic_index);
        require(topic_chits[topic_index].length > chit_index);
        require(reaction ==1 || reaction == 2);
        require(reactions[topic_index][chit_index][msg.sender] == 0);
        Chit storage c = topic_chits[topic_index][chit_index];
        if (reaction == 1){
            // like scenario
            reactions[topic_index][chit_index][msg.sender] = 1;
            c.likes_count ++;
        } else {
            // dislike    
            reactions[topic_index][chit_index][msg.sender] = 2;
            c.dislikes_count ++;
        }
    }

    function getReactions(uint topic_index, uint chit_index) public view returns (uint){
        require(topics.length > topic_index);
        require(topic_chits[topic_index].length > chit_index);
        return reactions[topic_index][chit_index][msg.sender];
    }

    function newChit(uint topic_index, string memory message) public{
        require(topics.length > topic_index);
        Chit memory c = Chit({
            message: message,
            author: msg.sender,
            likes_count :0,
            dislikes_count:0,
            reply_index:-1,
            created: block.timestamp,
            updated: block.timestamp
        });
        topic_chits[topic_index].push(c);
    }

    function updateChit(uint topic_index, uint chit_index, string memory message) public{
        require(topics.length > topic_index);
        require(topic_chits[topic_index].length > chit_index);
        require(topic_chits[topic_index][chit_index].author == msg.sender);
        topic_chits[topic_index][chit_index].message = message;
        topic_chits[topic_index][chit_index].updated = block.timestamp;
    }

    function newChitReply(uint topic_index, string memory message, uint256 reply_index) public{
        require(topics.length > topic_index);
        require(topic_chits[topic_index].length > reply_index);
        Chit memory c = Chit({
            message: message,
            author: msg.sender,
            likes_count :0,
            dislikes_count:0,
            reply_index: int(reply_index),
            created: block.timestamp,
            updated: block.timestamp
        });
        topic_chits[topic_index].push(c);
    }
}