function getAllChars() {
    $.get('http://localhost:3000/faction/all/chars', (data)=>{
        console.log(data);
        for (let i=0;i<data.length;i++) {
            let { id, name, race, faction_id } = data[i];
            let clas = data[i].class;
            let faction;
            if (faction_id==1) {faction='Space Marines'} else if (faction_id==2) {faction='Adeptus Sororitas'} else if (faction_id==3) {faction='Astra Militarum'} else if (faction_id==4) {faction='Inquisition'}
            $('#container').append(`<div id='subText${i}'></div>`);
            $(`#subText${i}`).append(`<h1 id='header${i}'></h1>`);
            $(`#header${i}`).text(`${name}`);
            $(`#header${i}`).css('margin-bottom','5px');
            $(`#subText${i}`).append(`<p id='extraText${i}'></p>`);
            $(`#extraText${i}`).html(`Race: ${race}<br>Faction: ${faction}<br>Class: ${clas}<br>ID: ${id}`);
            $(`#extraText${i}`).css('margin-top', '0px');
            $(`#subText${i}`).css("border-style", "solid");
            $(`#subText${i}`).css("border-width", "2px");
            $(`#subText${i}`).css("border-color", "aliceblue");
            $(`#subText${i}`).css("border-radius", "10px");
        }
    })
}

getAllChars();