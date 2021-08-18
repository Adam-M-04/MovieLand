class PersonDetails
{
    constructor(DV_ref, data)
    {
        this.DV_ref = DV_ref
        this.data = data

        this.swipers = []

        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS_person'
        this.DETAILS.appendChild(this.createMainDiv())
        this.DETAILS.appendChild(this.getBirth())
        
        if(data.combined_credits.cast.length > 0 && data.combined_credits.crew.length > 0)
        {
            //let sliders = 
            this.DETAILS.appendChild(createSlidersWithSwitcher(this, [this.data.combined_credits.cast.sort((a,b)=>{return b.popularity - a.popularity}),
            this.data.combined_credits.crew],['multi','multi'],['Cast', 'Crew'], true))
        }
        else 
        {
            if(data.combined_credits.cast.length > 0)
            {
                this.DETAILS.appendChild(createHeader('Cast'))
                this.swipers.push(createSlider(this.data.combined_credits.cast.sort((a,b)=>{return b.popularity - a.popularity}),
                     'multi', this.DV_ref.contentRef, true))
                this.DETAILS.appendChild(this.swipers[this.swipers.length-1].container)
            } 
            if(data.combined_credits.crew.length > 0)
            {
                this.DETAILS.appendChild(createHeader('Crew'))
                this.swipers.push(createSlider(data.combined_credits.crew, 'multi', this.DV_ref.contentRef, true))
                this.DETAILS.appendChild(this.swipers[this.swipers.length-1].container)
            } 
        }
    }

    createCastOrCrewSlider(data)
    {
        let Elements = []

        for(let person_data of data)
        {
            let person = new Card(person_data.media_type, person_data, this.DV_ref.contentRef, true)
            Elements.push(person.card)
        }

        return new Slider(Elements)
    }

    createMainDiv()
    {
        let profilePhoto = createIMG(
            (this.data.profile_path !== null) ? `https://image.tmdb.org/t/p/original${this.data.profile_path}` : '/img/default_person.svg',
            'DV_profile_img')
        profilePhoto.onerror = ()=>{profilePhoto.onerror = null; profilePhoto.src = '/img/default_person.svg'}

        let text = document.createElement('span')
        text.className = 'DV_main_text_person'

        let name = document.createElement('span')
        name.className = 'DV_name_of_person'
        name.innerHTML = this.data.name

        text.appendChild(name)
        if(this.data.biography) text.appendChild(this.getBiography())

        let MainDiv = document.createElement('div')
        MainDiv.className = 'DV_main_div_person'
        MainDiv.appendChild(profilePhoto)
        MainDiv.appendChild(text)

        return MainDiv
    }

    getBiography()
    {
        let biography = document.createElement('span')
        biography.className = 'DV_biography'
        biography.innerHTML = '<br>' + this.data.biography
        return biography
    }

    getBirth()
    {
        let birthday = document.createElement('div')
        birthday.className = 'DV_birthday'
        birthday.innerText = 'Birth: '
        if(!this.data.place_of_birth && !this.data.birthday) birthday.innerText += '?'
        else
        {
            birthday.innerText += (this.data.place_of_birth ? this.data.place_of_birth : ' ? ') + ', '
            birthday.innerText += this.data.birthday ? this.data.birthday : ' ? '
        }
        birthday.title = `Place of birth: ${this.data.place_of_birth ? this.data.place_of_birth : ' ? '}\nDate of birth: ${this.data.birthday ? this.data.birthday : ' ? '}`
        return birthday
    }
}