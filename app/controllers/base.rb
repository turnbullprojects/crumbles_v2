Crumbles::App.controllers :main do
    get :index, map: "/" do
      @title = "Crumbles"
      @description = "Crumbles are kinda like reaction GIFs with a way bigger vocabulary... and all you have to do to make one is type."
      @dictionaries = Dictionary.all
      render "index"
    end

    get :react, map: "/react" do
      render "react"
    end

end

