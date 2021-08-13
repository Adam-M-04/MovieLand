class PersonDetails
{
    constructor(DV_ref, data)
    {
        this.DV_ref = DV_ref
        this.data = data

        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS'
        this.DETAILS.appendChild(this.createMainDiv())
        this.DETAILS.appendChild(this.createMainText())
        if(data.combined_credits.cast.length > 0 && data.combined_credits.crew.length > 0)
        {
            let text = document.createElement('h2')
            text.innerHTML = "Credits"
            this.DETAILS.appendChild(text)
            this.DETAILS.appendChild(createSlidersWithSwitcher([this.data.combined_credits.cast.sort((a,b)=>{return b.popularity - a.popularity}),
                this.data.combined_credits.crew],['multi','multi'],['Cast', 'Crew'], true))
        }
        else 
        {
            let text = document.createElement('h2')
            text.innerText = 'Credits'
            if(data.combined_credits.cast.length > 0)
            {
                this.DETAILS.appendChild(text)
                this.DETAILS.appendChild(this.createCastOrCrewSlider(data.combined_credits.cast).container)
            } 
            if(data.combined_credits.crew.length > 0)
            {
                this.DETAILS.appendChild(text)
                this.DETAILS.appendChild(this.createCastOrCrewSlider(data.combined_credits.crew).container)
            } 
        }
    }

    createCastAndCrewSlider()
    {
        this.cast_crew_switch = new SwitchButton(['Cast', 'Crew'], this.switch_cast_crew, this)
 
        this.castSwiper = this.createCastOrCrewSlider(this.data.combined_credits.cast.sort((a,b)=>{return b.popularity - a.popularity}))

        this.crewSwiper = this.createCastOrCrewSlider(this.data.combined_credits.crew)

        this.DETAILS.appendChild(this.cast_crew_switch.container)
        this.DETAILS.appendChild(this.castSwiper.container)
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

        let MainDiv = document.createElement('div')
        MainDiv.className = 'DV_profilePhotoContainer'
        MainDiv.appendChild(profilePhoto)
        return MainDiv
    }

    createMainText()
    {
        let text = document.createElement('div')
        text.className = 'DV_mainText'

        let name = document.createElement('h2')
        name.className = 'DV_name'
        name.innerHTML = this.data.name
        text.appendChild(name)

        if(this.data.biography) text.appendChild(this.getBiography())

        text.appendChild(this.getBirth())

        return text
    }

    getBiography()
    {
        let biography = document.createElement('h4')
        biography.className = 'DV_biography'
        biography.innerHTML = this.data.biography
        if(this.data.biography.length > 250) biography.style.textAlign = 'justify'
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

    switch_cast_crew(ref)
    {
        if(ref.cast_crew_switch.current)
        {
            ref.castSwiper.container.remove()
            ref.DETAILS.appendChild(ref.crewSwiper.container)
            ref.crewSwiper.swiper.update()
        }
        else
        {
            ref.crewSwiper.container.remove()
            ref.DETAILS.appendChild(ref.castSwiper.container)
            ref.crewSwiper.swiper.update()
        }
    }
    
}