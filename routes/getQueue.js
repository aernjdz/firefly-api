

module.exports = (app) => {
    
    app.get("/api/getQueue", async (req,res) =>{
        res.status(200).send({message: "Point is dev"})
    });


}