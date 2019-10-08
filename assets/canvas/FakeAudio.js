var FakeAudioGenerator = {
    start: function() {
    
    },
    stop: function() {
    
    },
    getRandomAudioData: function() {
        var data = [];
        for (var x = 0; x < 128; x++) {
            data.push(Math.random() * 1.1);
        };
        return data;
    }
}